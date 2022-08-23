import React from "react";
import { Badge } from "./Badge";
import { ComponentStory } from '@storybook/react';

export default {
    title: "Stake/Badge",
    component: Badge,
};

const Template: ComponentStory<typeof Badge> = (args) => <Badge {...args} />;

export const Low = Template.bind({});
Low.args = {
    variant: "low",
};

export const Medium = Template.bind({});
Medium.args = {
    variant: "medium",
};

export const High = Template.bind({});
High.args = {
    variant: "high",
};