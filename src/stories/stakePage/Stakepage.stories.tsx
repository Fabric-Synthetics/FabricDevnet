import React from "react";
import { Stakepage } from "./Stakepage";
import { ComponentStory } from '@storybook/react';

export default {
    title: "Stake/Stakepage",
    component: Stakepage,
};

const Template: ComponentStory<typeof Stakepage> = (args) => <Stakepage {...args} />;
export const DefaultNotConnected = Template.bind({});
DefaultNotConnected.args = {
    bannerMessage: "This dApp is unaudited and may contain bugs. Use at your own risk.",
};