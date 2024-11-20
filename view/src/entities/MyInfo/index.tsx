import myInfoMockData from './const/myInfoMockData';
import InfoItem from './UI/InfoItem';

const MyInfo = () => {
  const myInfo = myInfoMockData;
  return (
    <div className="w-full h-[19rem] px-[4rem] py-[2.5rem] rounded bg-surface-default border-border-default border-[1px]">
      <InfoItem label="이름" value={myInfo.name} />
      <InfoItem label="이메일" value={myInfo.email} />
    </div>
  );
};

export default MyInfo;
