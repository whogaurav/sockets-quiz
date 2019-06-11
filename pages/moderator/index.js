import Layout from "../../comps/Layout";
import Button from "../../comps/Button";

export default () => (
  <Layout className="moderator-container-bg">
    <div className="main-screen-container">
      <Button
        nextNavigateLink="/moderator/start"
        title="Continue"
        className="btn-lg border"
        //onClick={this.onSubmit}
        style={{
          background: "linear-gradient(#a1defa, #5ca7de)",
          borderRadius: "50px",
          padding: "15px",
          width: "200px"
        }}
      />
    </div>
  </Layout>
);
