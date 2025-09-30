import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";

const FormField = ({ 
  label, 
  error, 
  required,
  className,
  ...props 
}) => {
  return (
    <div className={className}>
      {label && <Label required={required}>{label}</Label>}
      <Input error={error} {...props} />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default FormField;