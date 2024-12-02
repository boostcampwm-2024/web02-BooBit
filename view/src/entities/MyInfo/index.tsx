import useGetProfile from './model/useGetProfile';
import InfoItem from './UI/InfoItem';

const MyInfo = () => {
  const { data: myInfo } = useGetProfile();
  return myInfo ? (
    <div className="w-full h-[19rem] px-[4rem] py-[2.5rem] rounded bg-surface-default border-border-default border-[1px]">
      <InfoItem label="이름" value={myInfo.name} />
      <InfoItem label="이메일" value={myInfo.email} />
    </div>
  ) : (
    <div className="w-full h-[19rem] px-[4rem] py-[2.5rem] rounded bg-surface-default border-border-default border-[1px]"></div>
  );
};

export default MyInfo;
