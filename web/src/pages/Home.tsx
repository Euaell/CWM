import { JSX } from "react";
import {Button, Link, Text, Flex, Heading, Container} from "@chakra-ui/react";

export default function Home(): JSX.Element {
	const BG_Image: string = "https://picsum.photos/id/42/1920/1080";

	return (
		<Flex flexDirection="column" justifyContent={'center'} alignItems={'center'} height="100vh" bgImage={BG_Image} bgSize={"cover"}>

			<Container height="100px">
				<Heading fontSize="2xl" fontWeight="700">
					My Landing Page
				</Heading>
				<Text>
					This is my landing page. It has a background image and some text.
				</Text>
				<Button variant="solid">Get Started</Button>
				<Link href="/about">
					<Button variant="outlined">Learn More</Button>
				</Link>
			</Container>

		</Flex>
	)
}