import React from "react";
import {Switch} from "@headlessui/react";

interface IProps {
    className?: string,
    checked: boolean,
    onChange: (checked: boolean) => void,
    labelLeft: string,
    labelRight: string,
}

function ToggleSwitch(props: IProps) {

    const {className, checked, onChange, labelLeft, labelRight} = props;

    return <div className={`${className} flex flex-row`}>
        <div className='w-1/4'>{labelLeft}</div>
        <div className='w-1/2'>
            <Switch
                checked={checked}
                onChange={onChange}
                className={`${
                    checked ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex items-center h-6 rounded-full w-11`}
            >
                <span
                    className={`${
                        checked ? 'translate-x-6' : 'translate-x-1'
                    } inline-block w-4 h-4 transform bg-white rounded-full`}
                />
            </Switch>
        </div>
        <div className='w-1/4'>{labelRight}</div>
    </div>

}

export default ToggleSwitch;
