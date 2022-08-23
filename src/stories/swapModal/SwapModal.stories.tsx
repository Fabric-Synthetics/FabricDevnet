import React from "react";
import { SwapModal } from "./SwapModal";
import { ComponentStory } from "@storybook/react";

export default {
    title: "Stake/Swap Modal",
    component: SwapModal
};

const Template: ComponentStory<typeof SwapModal> = (args) => <SwapModal {...args} />;
export const Default = Template.bind({});
Default.args = {

};