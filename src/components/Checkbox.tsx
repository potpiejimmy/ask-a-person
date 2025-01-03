import "./Checkbox.css";

interface CheckboxProps {
    id: string;
    label: string;
    credit: string;
    subInfo: string;
    disabled: boolean;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export function Checkbox(props: CheckboxProps) {

    return (
        <div className={props.checked ? ' card-selected' : 'card-unselected'} onClick={() => {if (!props.disabled) props.onChange(!props.checked);}}>
            <div className="card">
                <div className="flex flex-col gap-2 items-center">
                    <div>
                        <img src={'/persons/' + props.id + '.jpg'} alt={props.label} title={props.credit} className="rounded-full w-20 h-20"/>
                    </div>
                    <div>
                        {props.label}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {props.subInfo}
                    </div>
                </div>
            </div>
        </div>
    );
}