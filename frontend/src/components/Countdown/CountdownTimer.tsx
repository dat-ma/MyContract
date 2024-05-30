import './Countdown.css';
import DateTimeDisplay from './DateTimeDisplay.tsx';
import useCountDown from './useCountDown.ts';

const ExpiredNotice = () => {
  return (
    <div className="expired-notice">
      <span className='font-bold text-5xl'>Expired!!!</span>
      <p>Please wait for the next time.</p>
    </div>
  );
};

const ShowCounter = ({ days, hours, minutes, seconds }:{ days:any, hours:any, minutes:any, seconds:any }) => {
  return (
    <div className="show-counter">
        <DateTimeDisplay isDanger={days <= 3} type="Days" value={days} />
        <p>:</p>
        <DateTimeDisplay isDanger={false} type="Hours" value={hours} />
        <p>:</p>
        <DateTimeDisplay isDanger={false} type="Mins" value={minutes} />
        <p>:</p>
        <DateTimeDisplay isDanger={false} type="Seconds" value={seconds} />
      
    </div>
  );
};

const NotExistEvent = () => {
  return (
    <div className="show-counter">
        <DateTimeDisplay isDanger={false} type="Days" value={'--'} />
        <p>:</p>
        <DateTimeDisplay isDanger={false} type="Hours" value={'--'} />
        <p>:</p>
        <DateTimeDisplay isDanger={false} type="Mins" value={'--'} />
        <p>:</p>
        <DateTimeDisplay isDanger={false} type="Seconds" value={'--'} />
    </div>
  );
}

const CountdownTimer = ({ targetDate, fromDate }: { targetDate:any, fromDate:any }) => {
  const [days, hours, minutes, seconds] = useCountDown(targetDate, fromDate);
  if (targetDate === 0 && fromDate === 0) {
    return <NotExistEvent />
  }
  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice />;
  } else {
    return <ShowCounter days={days} hours={hours} minutes={minutes} seconds={seconds} />;
  }
};

export default CountdownTimer;