import "./Checkbox.css";
import { GoInfo } from "react-icons/go";

interface CheckboxProps {
    id: string;
    label: string;
    info: string;
    disabled: boolean;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export function Checkbox(props: CheckboxProps) {

    return (
        <div className={props.checked ? ' card-selected' : 'card-unselected'} onClick={() => {if (!props.disabled) props.onChange(!props.checked);}}>
            <div className="card">
                <div className="flex flex-col gap-3 items-end">
                    <a href={props.info} target="_blank" rel="noreferrer"><GoInfo/></a>
                    <div className="flex flex-col gap-3 items-center">
                        <div>
                            <img src={'/persons/' + props.id + '.jpg'} alt={props.label} className="rounded-full w-20 h-20"/>
                        </div>
                        <div>
                            {props.label}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}