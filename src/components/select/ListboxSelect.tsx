import React, { useState, useRef, useEffect } from 'react';

interface IProps<T> {
    selected: T;
    setSelected: (selected: T) => void;
    optionList: T[];
    show: (selected: T) => string;
}

function ListboxSelect<T>(props: IProps<T>) {
    const { selected, setSelected, optionList, show } = props;
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // 点击外部关闭下拉框（不影响父级）
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // 切换下拉框状态（阻止冒泡到父级）
    const toggleDropdown = (e: React.MouseEvent) => {
        e.stopPropagation(); // 关键：仅阻止当前点击冒泡到父级
        setIsOpen(!isOpen);
    };

    // 选择选项（关闭自身 + 阻止冒泡）
    const handleSelect = (item: T, e: React.MouseEvent) => {
        e.stopPropagation(); // 阻止事件传到父级面板
        setSelected(item);
        setIsOpen(false); // 选择后关闭自身下拉框
    };

    return (
        <div ref={containerRef} className="relative mt-1 w-full">
            {/* 下拉按钮 */}
            <button
                type="button"
                className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm"
                onClick={toggleDropdown}
            >
                <span className="block truncate text-gray-900">{show(selected)}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
            </button>

            {/* 下拉选项面板 */}
            {isOpen && (
                <div
                    className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    onClick={(e) => e.stopPropagation()} // 面板内点击不冒泡
                >
                    {optionList.map((item, index) => (
                        <div
                            key={index}
                            className={`cursor-default select-none relative py-2 pl-10 pr-4 ${
                                selected === item
                                    ? 'text-amber-900 bg-amber-100'
                                    : 'text-gray-900 hover:bg-amber-100'
                            }`}
                            onClick={(e) => handleSelect(item, e)}
                        >
              <span className={`block truncate ${selected === item ? 'font-medium' : 'font-normal'}`}>
                {show(item)}
              </span>
                            {selected === item && (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                  <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ListboxSelect;
