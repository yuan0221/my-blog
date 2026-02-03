import React, { useState } from "react";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
// @ts-ignore
import { history } from "umi";

export default function () {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  async function submit() {
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, avatarUrl }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.status !== 201) {
        const errorText = await res.text();
        console.error(errorText);
        alert(errorText);
        return;
      }
      const data = await res.json();
      alert(`注册成功，欢迎加入，${data.name}`);
      history.push('/posts/create');
    } catch (err) {
      console.error(err);
      alert('注册失败，请稍后重试');
    }
  }

  return <div className="w-full flex justify-center">
    <div className="container lg:px-64 px-8 pt-16">
      <p className="text-3xl font-extrabold">用户注册</p>
      <div className="mt-8">
        <p>用户名</p>
        <TextInput value={name} onChange={setName} />
        <p className="mt-4">邮箱</p>
        <TextInput value={email} onChange={setEmail} />
        <p className="mt-4">密码</p>
        <TextInput value={password} onChange={setPassword} />
        <p className="mt-4">头像 URL（可选）</p>
        <TextInput value={avatarUrl} onChange={setAvatarUrl} placeholder="https://example.com/avatar.png" />
        {avatarUrl && <img src={avatarUrl} alt="头像预览" className="mt-2 w-32 h-32 rounded-full object-cover" />}
        <Button onClick={submit} disabled={!name || !email || !password}>注册</Button>
        <div className="mt-4">
          <span className="text-gray-600">已有账号？</span>
          <button
            onClick={() => history.push('/login')}
            className="ml-2 text-blue-600 hover:text-blue-800 underline"
          >
            立即登入
          </button>
        </div>
      </div>
    </div>
  </div>
}
