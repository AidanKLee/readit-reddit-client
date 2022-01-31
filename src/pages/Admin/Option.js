import React, { useMemo } from 'react';

const Option = (props) => {

    const { option, handleChange } = props

    const [ name, value, t, options ] = useMemo(() => option,[option])
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const type = useMemo(() => t,[])

    const renderInputType = () => {
        if (options) {
            if (options.type === 'color') {
                return (
                    <div className='colorPicker'>
                        <input onChange={handleChange} type={options && options.type ? options.type : type} name={name} id={name} value={value}/>
                        <input onChange={handleChange} type={'string'} name={name} id={name} value={value}/>
                    </div> 
                ) 
            } else if (options.type === 'number') {
                return (
                    <input onChange={handleChange} type={'number'} name={name} id={name} value={value} min={options.min} max={options.max}/>
                ) 
            } else if (options.type === 'textarea') {
                return (
                    <div className='textareaWrapper'>
                        <textarea onChange={handleChange} name={name} id={name} value={value} maxLength={options.max} placeholder={options.placeholder}/>
                        <p className='lengthCounter'>{option[1] ? options.max - option[1].length : options.max} characters remaining.</p>
                    </div>
                    
                ) 
            } else if (options.type === 'select') {
                return (
                    <select onChange={handleChange} name={name} id={name} value={value === null ? options.values[1] : value}>
                        {
                            options.options.map((option, i) => {
                                return <option key={options.values[i]} value={options.values[i]}>{option}</option>
                            })
                        }
                    </select>
                )
            } else if (options.type === 'text') {
                return (
                    <div className='inputWrapper'>
                        <input onChange={handleChange} name={name} id={name} value={value} maxLength={options.max} placeholder={options.placeholder}/>
                        <p className='lengthCounter'>{option[1] ? options.max - option[1].length : options.max} characters remaining.</p>
                    </div>
                    
                ) 
            } else if (options.type === 'range') {
                return (
                    <input onChange={handleChange} type={'range'} name={name} id={name} value={value} min={options.min} max={options.max} step={1}/>
                ) 
            } else if (type === 'boolean') {
                return (
                    <label className="switch">
                        <input onChange={handleChange} type='checkbox' name={name} id={name} checked={value}/>
                        <span className="slider"></span>
                    </label>
                )
            }
        } else if (type === 'number') {
            return <input onChange={handleChange} type='number' name={name} id={name} value={value} min={-1} max={1}/>
        } else if (type === 'string') {
            if (!name.includes('description')) {
                return <input onChange={handleChange} type='text' name={name} id={name} value={value}/>
            } else {
                return <textarea onChange={handleChange} name={name} id={name} value={value}></textarea>
            }
        } else if (type === 'boolean') {
            return (
                <label className="switch">
                    <input onChange={handleChange} type='checkbox' name={name} id={name} checked={value}/>
                    <span className="slider"></span>
                </label>
            )
        }
    }

    return (
        <li className={'optionsListItem' + (type.slice(0, 1).toUpperCase() + type.slice(1))} style={options && options.style ? options.style : {}}>
            <label htmlFor={name}>
                <p className='optionsListItemName'>{options && options.newName ? options.newName : name.split('_').map(word => word.slice(0, 1).toUpperCase() + word.slice(1)).join(' ')}</p>
                {options && options.description ? <p className='optionsListItemDescription'>{options.description}</p> : undefined}
            </label>
            {renderInputType()}
        </li>  
    )
}

export default Option;