import { CloseRounded } from '@mui/icons-material';
import { Box, Grid } from '@mui/material';
import { Backdrop, style, StyledModal } from '../../../styles';
import { InputField } from '../../inputField/InputField';
import './collateralManagementPanel.css';
import { Button } from '../../button/Button';
import { formatPriceNumber } from '../../../utils';
import { useState } from 'react';

interface CollateralManagementPanelProps {
    placeholderText: string;
    panelTitle: string;
    symbolIconUrl: string;
    symbolName: string;
    price: number;
    maxValue: number;
    maxValueLabel: string;
    connected: boolean;
    closePanel: () => void;
    isPanelOpen: boolean;
    buttonOnClickAction: () => void;
    buttonLabel: string;
    badgeLabel: string;
    isButtonLoading? : boolean;
    loadingText?: string;
    userDebtUsd?: number;
    maxUserDebtUsd?: number;
    cRatio?: number;
}

// TODO: rename to InputPanelModal
export const CollateralManagementPanel = ({
    placeholderText,
    panelTitle,
    symbolIconUrl,
    symbolName,
    price,
    maxValue,
    maxValueLabel,
    connected,
    closePanel,
    isPanelOpen,
    buttonOnClickAction,
    buttonLabel,
    badgeLabel,
    isButtonLoading = false,
    loadingText = undefined,
    userDebtUsd,
    maxUserDebtUsd,
    cRatio
}: CollateralManagementPanelProps) => {
    // @ts-ignore
    var expectedCratio = (Number.isNaN(parseFloat(document.getElementById("input-field-amount")?.value))) 
        ? cRatio || 0
        // @ts-ignore
        : Math.abs((maxUserDebtUsd || 0) / ((buttonLabel === 'Mint' ? userDebtUsd : -userDebtUsd ) + parseFloat(document.getElementById("input-field-amount")?.value) || 1) * 10);

    return (
        <StyledModal
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
            open={isPanelOpen}
            onClose={closePanel}
            BackdropComponent={Backdrop}
        >
            <Box sx={style} className='no-outline-on-focus'>
                <Grid container sm={12} spacing={0}>
                    <Grid item sm={11}>
                        <div className="panel-title-text">
                            {panelTitle}
                        </div>
                    </Grid>
                    <Grid item sm={1} className="panel-close-button-container pin-right scale-up-on-hover clickable" onClick={closePanel}>
                        <CloseRounded />
                    </Grid>
                    <InputField
                        placeholderText={placeholderText}
                        symbolIconUrl={symbolIconUrl}
                        symbolName={symbolName}
                        symbolPrice={price}
                        maxValue={maxValue}
                        maxValueLabel={maxValueLabel}
                        connected={connected}
                        step={0.01}
                        min={0.01}
                        inputFieldId='input-field-amount'
                        displayDecimals={2}
                    />
                </Grid>
                <Grid item sm={12}>
                    <div className='panel-live-price-badge' style={{marginRight: "15px"}}>
                        <div className='panel-live-price-badge-text'>
                            {`1 ${symbolName} <-> ${symbolName !== 'fUSD' ? price.toFixed(4) : 1} USD`}
                        </div>
                    </div>
                    {symbolName !== 'fUSD' 
                        ? <></> 
                        : <div className='panel-live-fee-badge'>
                            <div className='panel-live-fee-badge-text'>
                                {cRatio ? `C-ratio: ${formatPriceNumber.format(cRatio)} -> ${formatPriceNumber.format(expectedCratio)}` : 'Loading...'}
                            </div>
                        </div>}
                </Grid>
                <div className='divider'></div>
                <Grid item sm={12}>
                    <div className='panel-conversion-text'>
                        {
                            `${badgeLabel} ${
                                // @ts-expect-error
                                (Number.isNaN(parseFloat(document.getElementById("input-field-amount")?.value))) ? 0 : formatPriceNumber.format(parseFloat(document.getElementById("input-field-amount")?.value))} ${symbolName}`
                        }
                    </div>
                </Grid>
                <Grid item sm={12}>
                    <Button
                        onClick={buttonOnClickAction}
                        label={buttonLabel}
                        height={44}
                        loading={isButtonLoading}
                        loadingText={loadingText}
                    />
                </Grid>
            </Box>
        </StyledModal>
    );
};