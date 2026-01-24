import React, { useState } from 'react'

const Example = () => {
    const [selections, setSelections] = useState([[]]);
  const [currentColumn, setCurrentColumn] = useState(1);

  const handleSelectionChange = (event) => {
    const selection = event.target.value;

    if (selection === 't') {
      if (currentColumn !== 1) {
        // If "t" is selected and the current column is not 1, create a new column
        setCurrentColumn(1);
        setSelections([...selections, []]);
      }
    } else if (selection === 'r') {
      if (currentColumn !== 2) {
        // If "r" is selected and the current column is not 2, create a new column
        setCurrentColumn(2);
        setSelections([...selections, []]);
      }
    }

    const updatedSelections = [...selections];
    updatedSelections[currentColumn - 1] = updatedSelections[currentColumn - 1] || [];
    updatedSelections[currentColumn - 1].push(selection);

    setSelections(updatedSelections);
  };
  return (
    <div>
       <select onChange={handleSelectionChange}>
        <option value="t">t</option>
        <option value="r">r</option>
      </select>
      {selections.map((column, index) => (
        <div key={index} style={{ display: 'inline-block', margin: '10px' }}>
          <ul>
            {column.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default Example
