import { CircularProgress } from '@material-ui/core';
import './button.css';

interface ButtonProps {
    onClick: () => void;
    label: string;
    loading?: boolean;
    disabled?: boolean;
    className?: string;
    width?: number;
    maxWidth?: number;
    height?: number;
    fontSize? : number;
    loadingText?: string;
}

export const Button = ({
    onClick,
    label,
    loading,
    disabled,
    className,
    width,
    maxWidth,
    height,
    fontSize = 18,
    loadingText = undefined
}: ButtonProps) => {

    let style = {
        minWidth: (width ? `${width}px` : 'auto'), 
        maxWidth: (maxWidth ? `${maxWidth}px` : 'auto'),
        height: `${height}px`
    };
    return (
        <div className={"button-outline " + className} onClick={onClick} style={style}>
            <div className="button-label" style={{fontSize: `${fontSize}px`}}>
                {(loading) 
                    ? <>
                        <CircularProgress size={20} color="inherit" />
                        <div className='button-loading-text'>
                            {loadingText || ""}
                        </div>
                    </> 
                    : label}
            </div>
        </div>
    );
};