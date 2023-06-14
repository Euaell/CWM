#include "WiFi.h"
#include <HTTPClient.h>
#include <ArduinoJson.h>

#define LED_BUILTIN 2
#define SENSOR 22
#define CONTROL_PIN 18

long currentMillis = 0;
long previousMillis = 0;
int interval = 5000; // 5 sec
boolean ledState = LOW;
//float calibrationFactor = 0.2694005;
float calibrationFactor = 0.1524005;
volatile byte pulseCount;
byte pulse1Sec = 0;
float flowRate;
float flowLitres;
float totalLitres;

String host = "192.168.129.54";
String deviceId = "648405e7228c8957d910a9ff";

void IRAM_ATTR pulseCounter()
{
  pulseCount++;
}

//const char* ssid = "Galaxy A52 5G2F06";
//const char* password = "fxpp1519";
const char* ssid = "AP79DE";
const char* password = "memememe";
//const char* ssid = "kalabpc";
//const char* password = "kalabpcs";

char jsonOutput[128];

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  Serial.print("connecting to wifi ...");
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(SENSOR, INPUT_PULLUP);
  pinMode(CONTROL_PIN, OUTPUT);

  pulseCount = 0;
  flowRate = 0.0;
  flowLitres = 0;
  totalLitres = 0;
  previousMillis = 0;

  attachInterrupt(digitalPinToInterrupt(SENSOR), pulseCounter, FALLING);

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    Serial.println(WiFi.status());
      delay(500);
  }

  Serial.println();
  Serial.println("Connected!");

  Serial.println(WiFi.localIP());
}

void send(float volume, float flow) {
  HTTPClient client;

  client.begin("http://" + host + ":3015/api/v2/devices/read/" + deviceId);
  client.addHeader("Content-Type", "application/json");

  const size_t CAPACITY = JSON_OBJECT_SIZE( 2 );
  StaticJsonDocument<CAPACITY> doc;

  JsonObject object = doc.to<JsonObject>();
  object["flow"] = flow;
  object["volume"] = volume;

  serializeJson(doc, jsonOutput);

  int httpCode = client.POST(String(jsonOutput));
  if (httpCode > 0) {
    String payload = client.getString();
    Serial.println("\nStatuscode: " + String(httpCode));
    Serial.println(payload);

    char json[50];
    payload.replace("\n", "");
    payload.replace(" ", "");
    payload.trim();
    payload.toCharArray(json, 50);

    DynamicJsonDocument doc2(1024);
    deserializeJson(doc2, json);

    const char* message = doc2["message"];

    // set the cumilated volume to zero
     totalLitres = 0;
    if (String(message).equals("close")) {
      digitalWrite(LED_BUILTIN, HIGH);
      digitalWrite(CONTROL_PIN, HIGH);
    } else {
      digitalWrite(LED_BUILTIN, LOW);
      digitalWrite(CONTROL_PIN, LOW);
    }
    
  } else {
    Serial.println("Error on HTTP request");
  }

  client.end();
}

void printData(float volume, float flow) {
  // Print the flow rate for this second in litres / minute
  Serial.print("Flow rate: ");
  Serial.print(String(flow));  // Print the integer part of the variable
  Serial.print("L/min");
  Serial.print("\t");       // Print tab space

  // Print the cumulative total of litres flowed since starting
  Serial.print("Output Liquid Quantity: ");
  Serial.print(String(volume));
  Serial.println("L");
}

void loop() {
  currentMillis = millis(); // return the current millisecond from start
  if (currentMillis - previousMillis > interval) {
    
    pulse1Sec = pulseCount;
    pulseCount = 0;

    flowRate = ((1000.0 / (millis() - previousMillis)) * pulse1Sec) * calibrationFactor; // (1000.0 / (millis() - previousMillis)) -> number of milliseconds that have passed since previousMillis
                                                                                         // * pulse1Sec -> number of pulses counted 
                                                                                         // (/ calibrationFactor) -> gives ===> L/min
    flowLitres = flowRate / 60000; // -> L/min -> L/millisec
    totalLitres += (flowLitres * (currentMillis - previousMillis));
    previousMillis = millis();

    printData(totalLitres, flowRate); // to serial
    send(totalLitres, flowRate); // to api
  }
}

