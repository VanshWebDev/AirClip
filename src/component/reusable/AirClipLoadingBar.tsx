import { LoadingOutlined } from "@ant-design/icons";

export const AirClipLoadingBar = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <LoadingOutlined style={{ fontSize: "30px" }} />
    </div>
  );
};
