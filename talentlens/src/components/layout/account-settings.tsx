import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Card, Drawer, Form, Input, Spin } from "antd";
import { useState } from "react";
import { Text } from "../text";
import CustomAvatar from "./custom-avatar";
import { getNameInitials } from "@/utilities";
import type { User } from "../../providers/auth";

type Props = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  userId: string;
};

const SESSION_KEY = "talentlens_user";

export const AccountSettings = ({ opened, setOpened }: Props) => {
  const raw = localStorage.getItem(SESSION_KEY);
  const user: User | undefined = raw ? JSON.parse(raw) : undefined;
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const handleSave = async () => {
    const values = await form.validateFields();
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    const updated = { ...user, ...values };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    setSaving(false);
    setOpened(false);
  };

  if (!user) return <Drawer open={opened} width={756}><Spin /></Drawer>;

  return (
    <Drawer
      onClose={() => setOpened(false)}
      open={opened}
      width={756}
      styles={{
        body: { background: "#f5f5f5", padding: 0 },
        header: { display: "none" },
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", backgroundColor: "#fff" }}>
        <Text strong>Account Settings</Text>
        <Button type="text" icon={<CloseOutlined />} onClick={() => setOpened(false)} />
      </div>
      <div style={{ padding: "16px" }}>
        <Card>
          <Form form={form} layout="vertical" initialValues={user}>
            <CustomAvatar
              shape="square"
              name={getNameInitials(user.name || "")}
              style={{ width: 96, height: 96, marginBottom: "24px" }}
            />
            <Form.Item label="Name" name="name">
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item label="Job Title" name="jobTitle">
              <Input placeholder="Job Title" />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
              <Input placeholder="Phone" />
            </Form.Item>
          </Form>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={saving}
            onClick={handleSave}
            style={{ display: "block", marginLeft: "auto" }}
          >
            Save
          </Button>
        </Card>
      </div>
    </Drawer>
  );
};
