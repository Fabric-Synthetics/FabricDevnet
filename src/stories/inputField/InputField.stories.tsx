import React from "react";
import { InputField } from "./InputField";
import { ComponentStory } from "@storybook/react";

export default {
    title: "Stake/Input Field",
    component: InputField,
};

const Template: ComponentStory<typeof InputField> = (args) => <InputField {...args} />;
export const Default = Template.bind({});
Default.args = {
    placeholderText: "",
    symbolIconUrl: "",
    symbolName: "",
    symbolPrice: 0,
    maxValue: 0,
    maxValueLabel: "",
    connected: false,
    step: 0.01,
    min: 0.01,
    inputFieldId: "input-field-amount",
};