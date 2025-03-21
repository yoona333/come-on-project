"use client";

// errorbank.tsx
import React, { Component } from 'react';
import axios, { AxiosError } from 'axios';
import { Redirect } from 'react-router-dom';
import Home from '../homedaohan/page'; // 确保这里的路径是正确的
import styles from '../css/ErrorBankPage.module.css';


interface ErrorBankItem {
  id: number;
  Wrong_name: string;
  Wrong_content: string;
  Wrong_type: string;
  Wrong_file: string;
  Wrong_author: string;
}

interface IState {
  errorBankData: ErrorBankItem[];
  error: string | null;
  isLoading: boolean;
  redirectToLogin: boolean;
  currentPage: number;
  totalPages: number;
  limit: number;
  name: string;
  isModalOpen: boolean;
  modalErrorItem?: ErrorBankItem;
}

const ErrorDetailModal = ({ errorItem, onClose }: { errorItem: ErrorBankItem; onClose: () => void }) => {
  if (!errorItem) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>错题详情</h2>
        <p><strong>错题名称:</strong> {errorItem.Wrong_name}</p>
        <p><strong>错题内容:</strong> {errorItem.Wrong_content}</p>
        <p><strong>错题类型:</strong> {errorItem.Wrong_type}</p>
        <p><strong>错题文件:</strong> {errorItem.Wrong_file}</p>
        <p><strong>错题作者:</strong> {errorItem.Wrong_author}</p>
      </div>
    </div>
  );
};

class ErrorBankPage extends Component<{}, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      // ...其他状态保持不变
      errorBankData: [],
      error: null,
      isLoading: true,
      redirectToLogin: false,
      currentPage: 1,
      totalPages: 0,
      limit: 4,
      name: '',
      isModalOpen: false,
      modalErrorItem: undefined, // 修改此处的初始值为undefined
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      this.setState({ redirectToLogin: true });
      return;
    }

    const { currentPage, limit, name } = this.state;
    let url = 'http://localhost:3000/errorbank/me';

    // 根据name的状态来决定使用哪个URL
    if (name.trim()) { // 如果name不为空且非只包含空格
      url = `http://localhost:3000/errorbank/me/qu/${encodeURIComponent(name)}`;
    }

    try {
      const response = await axios.get<{ data: ErrorBankItem[], totalPages: number }>(
        url,
        {
          headers: { 'x-access-token': token },
          params: { page: currentPage, limit: limit },
        }
      );
      this.setState({
        errorBankData: response.data.data,
        totalPages: response.data.totalPages,
        isLoading: false,
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = axiosError.message || 'An unknown error occurred';
      this.setState({ error: errorMessage, isLoading: false });
      if (axiosError.response && axiosError.response.status === 401) {
        this.setState({ redirectToLogin: true });
      }
    }
  };

  handlePageChange = (newPage: number) => {
    this.setState({ currentPage: newPage, isLoading: true }, () => {
      this.fetchData();
    });
  };

  handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 更新输入框的值到state，并设置currentPage为1
    this.setState({ name: event.target.value, currentPage: 1, isLoading: true }, () => {
      this.fetchData();
    });
  };

  handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    this.setState({ currentPage: 1, isLoading: true, name: '' }, () => {
      this.fetchData();
    });
  };

  openModal = (errorItem: ErrorBankItem | null) => {
    if (errorItem !== null) {
      this.setState({ isModalOpen: true, modalErrorItem: errorItem });
    } else {
      // 处理errorItem为null的情况，可能什么都不做或者设置一个默认值
    }
  };
  closeModal = () => {
    this.setState({ isModalOpen: false, modalErrorItem: undefined }); // 使用undefined代替null
  };

  render() {
    const { 
      errorBankData, 
      error, 
      isLoading, 
      redirectToLogin, 
      currentPage, 
      totalPages, 
      name, 
      isModalOpen,
      modalErrorItem,
    } = this.state;

    if (redirectToLogin) {
      return <Redirect to="/login" />;
    }

    return (
      <div className={styles.container}>
        <Home /> 
         <div className={styles.header}>
          {/* <h1>Error Bank Data</h1> */}
          <br /><br /><br />
          <form onSubmit={this.handleSearchSubmit} className={styles.searchContainer}>
            
            <input
              type="text"
              placeholder="Search by name..."
              value={name}
              onChange={this.handleSearchChange}
              className={styles.searchInput}
            />
            {/* <button type="submit" className={styles.searchButton}>
              Search
            </button> */}
          </form>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.tableContainer}>
          <table className={styles.errorBankTable}>
            <thead>
              <tr>
                <th>Wrong Name</th>
                <th>Wrong Type</th>
                <th>Wrong Author</th>
                <th>Actions</th>
                <th>revise</th>
              </tr>
            </thead>
            <tbody>
              {errorBankData.map((item) => (
                <tr key={item.id}>
                  <td>{item.Wrong_name}</td>
                  <td>{item.Wrong_type}</td>
                  <td>{item.Wrong_author}</td>
                  <td>
                    <button
                      onClick={() => this.openModal(item)}
                      className={styles.actionButton}
                    >
                      查看详情
                    </button>
                  </td>
                  <td>
                    <a href={`/myerrorbank/update?id=${item.id}`}>修改错题</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => this.handlePageChange(currentPage - 1)}
            className={styles.paginationButton}
          >
            上一页
          </button>
          <span>当前页面: {currentPage} / {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => this.handlePageChange(currentPage + 1)}
            className={styles.paginationButton}
          >
            下一页
          </button>
        </div>
        {isModalOpen && modalErrorItem && (
          <div className={styles.modalBackground} onClick={this.closeModal}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <span className={styles.modalClose} onClick={this.closeModal}>
                &times;
              </span>
              <h2>错题详情</h2>
              <p><strong>错题名称:</strong> {modalErrorItem.Wrong_name}</p>
              <p><strong>错题内容:</strong> {modalErrorItem.Wrong_content}</p>
              <p><strong>错题类型:</strong> {modalErrorItem.Wrong_type}</p>
              <p><strong>错题文件:</strong> {modalErrorItem.Wrong_file}</p>
              <p><strong>错题作者:</strong> {modalErrorItem.Wrong_author}</p>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ErrorBankPage;