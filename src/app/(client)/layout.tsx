
interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({children}: ClientLayoutProps) => {
  return <div>{children}</div>;
};

export default ClientLayout;
