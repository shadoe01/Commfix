export default function Button({ children, variant = "primary", block, ...rest }) {
  const cls = `btn btn-${variant}${block ? " btn-block" : ""}`;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
