import React from "react";

interface CheckboxProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export function Checkbox(props: CheckboxProps) {

    return (
        <label className="checkbox">
            <div className="flex flex-row gap-3 items-center">
                <input type="checkbox" checked={props.checked} onChange={() => props.onChange(!props.checked)}/>
                <div className="checkbox-circle">
                    <svg viewBox="0 0 52 52" className="checkmark">
                        <circle fill="none" r="25" cy="26" cx="26" className="checkmark-circle"></circle>
                        <path d="M16 26l9.2 8.4 17.4-21.4" className="checkmark-kick"></path>
                    </svg>
                </div>
                <div>{props.label}</div>
            </div>
        </label>
    );
}