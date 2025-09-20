import React from "react";

interface IProps {
    className?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    labelLeft: string;
    labelRight: string;
}

function ToggleSwitch(props: IProps) {
    const { className, checked, onChange, labelLeft, labelRight } = props;

    return (
        <div className={`${className} flex flex-row items-center`}>
            <div className='w-1/4 text-gray-200'>{labelLeft}</div>
            <div className='w-1/2'>
                <button
                    type="button"
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                        checked ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                    onClick={() => onChange(!checked)}
                    aria-pressed={checked}
                >
          <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  checked ? 'translate-x-6' : 'translate-x-1'
              }`}
          />
                </button>
            </div>
            <div className='w-1/4 text-gray-200'>{labelRight}</div>
        </div>
    );
}

export default ToggleSwitch;
