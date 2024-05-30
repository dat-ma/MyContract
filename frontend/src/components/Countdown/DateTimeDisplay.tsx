const DateTimeDisplay = ({ value, type, isDanger }:{ value:any, type:any, isDanger:any }) => {
    return (
      <div className={isDanger ? 'countdown danger' : 'countdown'}>
        <p className="font-bold text-5xl">{value}</p>
        <span>{type}</span>
      </div>
    );
  };
  
  export default DateTimeDisplay;