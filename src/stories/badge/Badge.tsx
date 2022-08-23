import { ArrowUpwardRounded } from '@mui/icons-material';
import './badge.css';

interface BadgeProps {
    variant: string;
    className?: string;
}

export const Badge = ({
    variant,
    className
}: BadgeProps) => {
    if (variant !== 'high' && variant !== 'medium' && variant !== 'low') {
        throw new Error('Badge: variant must be one of "high", "medium", or "low"');
    }

    if (variant === 'high') {
        return (
            <div className={"high-risk-container inline-div " + (className !== undefined ? className : "")}>
                <div className="high-risk-icon">
                    <ArrowUpwardRounded />
                </div>
                <span className="high-risk-text">
                    High
                </span>
            </div>
        );
    } else if (variant === 'medium') {
        return (
            <div className={"medium-risk-container inline-div " + (className !== undefined ? className : "")}>
                <div className="medium-risk-icon" style={{transform: "rotate(90deg)"}} >
                    <ArrowUpwardRounded />
                </div>
                <span className="medium-risk-text">
                    Medium
                </span>
            </div>
        );
    } else if (variant === 'low') {
        return (
            <div className={"low-risk-container inline-div " + (className !== undefined ? className : "")}>
                <div className="low-risk-icon" style={{transform: "rotate(180deg)"}} >
                    <ArrowUpwardRounded />
                </div>
                <span className="low-risk-text">
                    Low
                </span>
            </div>
        );
    }

    return <></>;
};