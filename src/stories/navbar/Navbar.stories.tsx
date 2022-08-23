import React from "react";
import { Navbar } from "./Navbar";
import { ComponentStory } from '@storybook/react';

export default {
    title: "Stake/Navbar",
    component: Navbar,
};

const Template: ComponentStory<typeof Navbar> = (args) => <Navbar {...args} />;
export const DefaultNotConnected = Template.bind({});
DefaultNotConnected.args = {
    currentPage: "Stake",
};