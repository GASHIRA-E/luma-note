import { Input } from "@chakra-ui/react";

type InputProps = React.ComponentProps<typeof Input>;

export const CustomInput = (props: InputProps) => {
  return (
    <Input
      {...props}
      _selection={{
        bg: "rgba(0, 0, 0, 0.2)",
        ...props._selection,
      }}
      _dark={{
        _selection: {
          bg: "rgba(255, 255, 255, 0.3)",
          ...props._dark?._selection,
        },
      }}
    />
  );
};
