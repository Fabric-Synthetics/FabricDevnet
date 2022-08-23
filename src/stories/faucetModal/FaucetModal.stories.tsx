import React from "react";
import { FaucetModal } from "./FaucetModal";
import { ComponentStory } from '@storybook/react';

export default {
    title: "Stake/Faucet Modal",
    component: FaucetModal,
};

const Template: ComponentStory<typeof FaucetModal> = (args) => <FaucetModal {...args} />;
export const DefaultNotConnected = Template.bind({});
DefaultNotConnected.args = {
};