import React from "react";
import { CollateralManagementPanel } from "./CollateralManagementPanel";
import { ComponentStory } from "@storybook/react";

export default {
    title: "Stake/Collateral Management Panel",
    component: CollateralManagementPanel,
};

const Template: ComponentStory<typeof CollateralManagementPanel> = (args) => <CollateralManagementPanel {...args} />;
export const Default = Template.bind({});
Default.args = {
    
};