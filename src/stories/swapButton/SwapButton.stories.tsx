import React from "react";
import { SwapButton } from "./SwapButton";
import { ComponentStory } from "@storybook/react";

export default {
    title: "Stake/Swap button",
    component: SwapButton,
};

const Template: ComponentStory<typeof SwapButton> = (args) => <SwapButton {...args} />;
export const Default = Template.bind({});
Default.args = {

};