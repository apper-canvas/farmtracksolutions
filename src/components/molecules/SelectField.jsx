import Label from "@/components/atoms/Label";
import Select from "@/components/atoms/Select";

const SelectField = ({ 
  label, 
  error, 
  required,
  children,
  className,
  ...props 
}) => {
  return (
    <div className={className}>
      {label && <Label required={required}>{label}</Label>}
      <Select error={error} {...props}>
        {children}
      </Select>
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default SelectField;