// 引用: https://qiita.com/wataru775/items/61db1371655897aea517 (感謝)
export const AnchorTag = ({ node, children, ...props }: any) => {
  try {
    new URL(props.href ?? "");
    props.target = "_blank";
    props.rel = "noopener noreferrer";
  } catch (e) {}
  return <a {...props}>{children}</a>;
};
