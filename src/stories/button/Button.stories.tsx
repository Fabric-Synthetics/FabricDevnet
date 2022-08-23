import React from "react";
import { Button } from "./Button";
import { ComponentStory } from "@storybook/react";

export default {
    title: "Stake/Button",
    component: Button,
};

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;
export const Default = Template.bind({});
Default.args = {
    onClick: () => {},
    disabled: false,
    className: "",
    width: 200,
    height: 40,
}