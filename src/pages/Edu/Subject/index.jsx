import React, { Component } from "react";
import { Button, Table, Tooltip, Input, message, Modal } from "antd";
import { PlusOutlined, FormOutlined, DeleteOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import {
  getSubjectList,
  getSecSubjectList,
  updateSubjectList,
  delSubjectList,
} from "./redux";
import { reqUpdateSubject } from "@api/edu/subject";
import "./index.less";

const data = [
  {
    key: 1,
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    description:
      "My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.",
  },
  {
    key: 2,
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    description:
      "My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.",
  },
  {
    key: 3,
    name: "Not Expandable",
    age: 29,
    address: "Jiangsu No. 1 Lake Park",
    description: "This not expandable",
  },
  {
    key: 4,
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    description:
      "My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.",
  },
];
@connect((state) => ({ subjectList: state.subjectList }), {
  getSubjectList,
  getSecSubjectList,
  updateSubjectList,
  delSubjectList,
})
class Subject extends Component {
  state = {
    subjectid: "",
    title: "",
  };
  page = 1;
  //页面创建好之后发请求
  componentDidMount() {
    this.props.getSubjectList(1, 5);
  }
  // 页码改变的回调
  handleChange = (page, pageSize) => {
    this.page = page;
    this.props.getSubjectList(page, pageSize);
  };
  //pageSize 变化的回调
  handleShowSizeChange = (page, pageSize) => {
    this.props.getSubjectList(page, pageSize);
  };
  //点击展开二级分类回调
  handleExpnd = (expand, record) => {
    if (expand) {
      this.props.getSecSubjectList(record._id);
    }
  };
  //点击新增回调
  handleAdd = () => {
    this.props.history.push("/edu/subject/add");
  };
  //更新按钮的回调
  handleUpdate = ({ _id, title }) => () => {
    this.setState({
      subjectid: _id,
      title: title,
    });
    this.title = title; //记录旧的标题
  };
  //更改课程分类标题受控组件的事件回调
  handleUpdateChange = (e) => {
    this.setState({
      title: e.target.value,
    });
  };
  //点击取消按钮触发的回调
  handleCancle = () => {
    this.setState({
      subjectid: "",
      title: "",
    });
  };
  //点击确认按钮更新课程触发的回调
  handleConfirm = async () => {
    //输入内容不能为空
    if (!this.state.title.trim()) {
      message.warn("课程名称不能为空");
      return;
    }
    //修改的数据不能与旧的一致
    if (this.state.title === this.title) {
      // console.log(this.title)
      return;
    }
    let id = this.state.subjectid;
    let title = this.state.title;
    // await reqUpdateSubject(id,title)
    await this.props.updateSubjectList(id, title);
    message.success("数据更新成功");
    this.setState({
      subjectid: "",
      title: "",
    });
    //重新请求一级菜单数据
    // this.props.getSubjectList(1,5)
  };
  //删除课程回调
  handleDel = (record) => () => {
    Modal.confirm({
      title: (
        <>
          你确定要删除
          <span style={{ color: "red", margin: "0 10px" }}>{record.title}</span>
          吗？
        </>
      ),
      onOk: async () => {
        await this.props.delSubjectList(record._id);
        message.success("删除数据成功");
        console.log(record);
        if (record.parentId === "0") {
          console.log(this.page, this.props.subjectList.items.length);
          // setTimeout(() => {
          //   console.log(this.page, this.props.subjectList.items.length);
          // }, 2000);
          if (this.page > 1 && this.props.subjectList.items.length === 0) {
            this.props.getSubjectList(--this.page, 5);

            return;
          }
          this.props.getSubjectList(this.page, 5);
        }
      },
    });
  };
  render() {
    const columns = [
      {
        title: "分类名称",
        //  dataIndex: 'title',
        key: "name",
        render: (record) => {
          if (this.state.subjectid === record._id) {
            return (
              <Input
                style={{ width: 200 }}
                value={this.state.title}
                onChange={this.handleUpdateChange}
              ></Input>
            );
          }
          return record.title;
        },
      },
      {
        title: "操作",
        // dataIndex: '',
        key: "x",
        render: (record) => {
          if (this.state.subjectid === record._id) {
            return (
              <>
                <Button
                  type="primary"
                  style={{ marginRight: 10 }}
                  onClick={this.handleConfirm}
                >
                  确定
                </Button>
                <Button type="danger" onClick={this.handleCancle}>
                  取消
                </Button>
              </>
            );
          } else {
            return (
              <>
                <Tooltip placement="top" title="更新课程">
                  <Button
                    icon={<FormOutlined />}
                    type="primary"
                    style={{ width: 40, marginRight: 10 }}
                    onClick={this.handleUpdate(record)}
                  ></Button>
                </Tooltip>
                <Tooltip placement="top" title="删除课程">
                  <Button
                    icon={<DeleteOutlined />}
                    type="danger"
                    style={{ width: 40 }}
                    onClick={this.handleDel(record)}
                  ></Button>
                </Tooltip>
              </>
            );
          }
        },
        width: 200,
      },
    ];
    return (
      <div className="subject">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="subject-btn"
          onClick={this.handleAdd}
        >
          新建
        </Button>
        <Table
          columns={columns}
          expandable={{
            // expandedRowRender: (record) => (
            //   <p style={{ margin: 0 }}>{record.description}</p>
            // ),
            // rowExpandable: (record) => record.name !== "Not Expandable",
            onExpand: this.handleExpnd,
          }}
          dataSource={this.props.subjectList.items}
          rowKey="_id"
          pagination={{
            current: this.page,
            total: this.props.subjectList.total,
            showSizeChanger: true,
            pageSizeOptions: ["5", "7", "9"],
            showQuickJumper: true,
            defaultPageSize: 5,
            onChange: this.handleChange,
            onShowSizeChange: this.handleShowSizeChange,
          }}
        />
      </div>
    );
  }
}

export default Subject;
