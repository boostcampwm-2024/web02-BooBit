const InfoItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="mb-[1.5rem] border-border-default border-b-[1px] text-display-bold-24 text-text-light">
      {label}
      <div className="my-[1.125rem] text-available-medium-18 text-text-dark">{value}</div>
    </div>
  );
};

export default InfoItem;
