import { Grid } from "@mui/material";
import React, { useEffect } from "react";
import { SymbolDetails } from "../../interfaces/SymbolDetails";
import { formatNumber, formatPriceNumber } from "../../utils";
import './inputField.css';


interface InputFieldProps {
    placeholderText: string;

    symbolIconUrl: string;
    symbolName: string;
    symbolPrice: number;

    maxValue: number;
    maxValueLabel: string;
    connected: boolean;
    step?: number;
    min?: number;
    inputFieldId: string;
    className?: string;

    assetList?: SymbolDetails[];

    onChange?: () => void;
    onSelection?: (value: any) => void;

    displayDecimals: number;
}

export const InputField = ({
    placeholderText,
    symbolIconUrl,
    symbolName,
    symbolPrice,
    maxValue,
    maxValueLabel,
    connected,
    step = 0.01,
    min = 0.01,
    inputFieldId,
    className = 'input-field',
    onChange,
    assetList,
    onSelection,
    displayDecimals
}: InputFieldProps) => {
    const [value, setValue] = React.useState(symbolName);
    var cappedMaxValue = maxValue;
    cappedMaxValue = cappedMaxValue < 0 ? 0 : cappedMaxValue;

    useEffect(() => {
        setValue(symbolName);
    }, [symbolName])

    function handleChange(event: any) {
        setValue(event.target.value);
        if (onSelection) {
            onSelection(event.target.value);
        }
    }

    return (
        <Grid container sm={12}>
            <Grid container sm={10} className='input-field-container'>
                <Grid item sm={12} className='input-field-wrapper'>
                    <input
                        className={className}
                        id={inputFieldId}
                        type="number"
                        maxLength={20}
                        placeholder='Amount'
                        step={step}
                        min={min}
                        autoComplete='off'
                        onChange={onChange}
                    />
                    <div className='input-field-dropdown pin-right clickable scale-up-on-hover'>
                        <select className='input-field-dropdown-option-container inline-div' value={value} onChange={handleChange}>
                            {assetList 
                                ? assetList?.map((asset, index) => {
                                    return (<option value={asset.name.toString()} id={asset.name.toString()}>{asset.name}</option>); })
                                : <option value={symbolName.toString()} id={symbolName.toString()}>{symbolName}</option> }
                        </select>
                    </div>
                </Grid>
                <Grid container sm={12}>
                    <Grid item sm={6}>
                        <div className='input-field-usd-value-text input-field-usd-value-estimate'>
                            ~{
                                // @ts-expect-error
                                (Number.isNaN(parseFloat(document.getElementById(inputFieldId)?.value)))
                                    ? formatPriceNumber.format(0)
                                    // @ts-expect-error
                                    : formatPriceNumber.format(parseFloat(document.getElementById(inputFieldId)?.value) * symbolPrice)
                            } USD
                        </div>
                    </Grid>
                    <Grid item sm={6} className="pin-right">
                        <div className='input-field-usd-value-text pin-right clickable-link' onClick={() => {
                            // @ts-expect-error
                            document.getElementsByClassName(className)[0].value = cappedMaxValue;
                            if (onChange) { onChange(); }
                        }}>
                            {connected ? (`${maxValueLabel}: ${formatNumber(cappedMaxValue, displayDecimals)}`) : "N/A"}
                        </div>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container sm={2} style={{ paddingLeft: '12px' }} className='hide-on-mobile'>
                <Grid item sm={12}>
                    <div className='input-field-max-button scale-up-on-hover clickable' onClick={() => {
                        // @ts-expect-error
                        document.getElementById(inputFieldId).value = cappedMaxValue;
                        if (onChange) { onChange(); }
                    }}>
                        <div className='input-field-max-button-text clickable'>
                            Max
                        </div>
                    </div>
                </Grid>
                <Grid item sm={12}>
                    <div className='input-field-half-button scale-up-on-hover clickable' onClick={() => {
                        // @ts-expect-error
                        document.getElementById(inputFieldId).value = (cappedMaxValue / 2);
                        if (onChange) { onChange(); }
                    }}>
                        <div className='input-field-half-button-text clickable'>
                            Half
                        </div>
                    </div>
                </Grid>
            </Grid>
        </Grid>
    );
}