import React from "react";
import { AssetPanel } from "./AssetPanel";
import { ComponentStory } from '@storybook/react';

export default {
    title: "Stake/Asset Panel",
    component: AssetPanel,
};

const Template: ComponentStory<typeof AssetPanel> = (args) => <AssetPanel {...args} />;
export const DefaultNotConnected = Template.bind({});
DefaultNotConnected.args = {
    variant: "collateral"
};