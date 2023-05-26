import { ChangeEvent, FormEvent, useState } from "react";

export default function useForm<T>(initialValues: T, onSubmit?: (values: T) => void) {
	const [values, setValues] = useState(initialValues);
	const [errors, setErrors] = useState(initialValues);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (onSubmit)
			onSubmit(values);
	};

	const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
		const { name, value }: { name: string, value: string | number} = event.target;
		setValues({ ...values, [name]: value });
	};

	return {
		values,
		setValues,
		handleSubmit,
		handleChange,
		errors,
		setErrors
	};
}
