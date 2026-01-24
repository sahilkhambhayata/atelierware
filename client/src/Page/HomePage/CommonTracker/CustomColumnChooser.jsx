function CustomColumnChooser({ columns, hiddenColumns, onColumnToggle }) {
  const colunmsLength = columns.length;

  return (
    <>
      <div className="custom-column-chooser g">
        {columns?.length > 0 &&
          columns?.map((column, i) => (
            <div key={column.name} className="custom-control custom-checkbox">
              <div className=" py-1 ms-2">
                <input
                  type="checkbox"
                  className="custom-control-input "
                  id={column.name}
                  checked={!hiddenColumns.includes(column.name)}
                  onChange={() => onColumnToggle(column.name)}
                />
                <label
                  className="custom-control-label me-5"
                  htmlFor={column.name}
                >
                  {column.title}

                  {colunmsLength === i + 1 && <> more </>}
                </label>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default CustomColumnChooser;
