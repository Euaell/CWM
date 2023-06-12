import React, { JSX, useRef } from "react";
import { Button, Input, message, Pagination, Space, Table } from "antd";
import type { ColumnType, ColumnsType } from 'antd/es/table';
import { apiEndpoint, ENDPOINTS } from "../../helper/api";
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

type DataIndex = keyof DataType;

export default function ViewCustomers(): JSX.Element {
	const [data, setData] = React.useState<DataType[]>([]);
	const [loading, setLoading] = React.useState<boolean>(true);
	const [searchText, setSearchText] = React.useState<string>('');
	const [searchedColumn, setSearchedColumn] = React.useState<DataIndex>();
	const searchInput = useRef<InputRef>(null);
	const [messageApi, contextHolder] = message.useMessage()

	const [page, setPage] = React.useState(1);
	const [limit, setLimit] = React.useState(10);
	const [total, setTotal] = React.useState(0);

	function fetchCustomers(dataIndex: DataIndex | null = null, value: string | number | boolean | null = null, startOver = false) {
		setLoading(true)
		apiEndpoint(ENDPOINTS.customers.getCustomers + `?limit=${limit}&page=${(startOver ? 1 : page)}` + (dataIndex ? `&${dataIndex}=${value}` : ''))
			.get()
			.then((response) => {
				return response.data
			})
			.then(data => {
				console.log(data)
				setData(data.customers)
				setTotal(data.total)
			})
			.catch((error) => {
				console.log(error)
				messageApi.error("Something went wrong!")
			})
			.finally(() => {
				setLoading(false)
			})
	}

	function handleSearch(selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
		fetchCustomers(dataIndex, selectedKeys[0], true)
	}

	const handleReset = (clearFilters: () => void) => {
		clearFilters();
		setSearchText('');
		setSearchedColumn(undefined);
		fetchCustomers()
	};

	function getColumnSearchProps (dataIndex: DataIndex): ColumnType<DataType> {

		return {
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
				<div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
					<Input
						ref={searchInput}
						placeholder={`Search ${dataIndex}`}
						value={selectedKeys[0]}
						onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
						onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
						style={{ marginBottom: 8, display: 'block' }}
					/>
					<Space>
						<Button
							type="primary"
							onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
							icon={<SearchOutlined />}
							size="small"
							style={{ width: 90 }}
						>
							Search
						</Button>
						<Button
							onClick={() => clearFilters && handleReset(clearFilters)}
							size="small"
							style={{ width: 90 }}
						>
							Reset
						</Button>
					</Space>
				</div>
			),
			filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
			onFilterDropdownOpenChange: (visible: boolean) => {
				if (visible) {
					setTimeout(() => searchInput.current?.select(), 100);
				}
			},
			render: (text: string) =>
				searchedColumn === dataIndex ? (
					<Highlighter
						highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
						searchWords={[searchText]}
						autoEscape
						textToHighlight={text ? text.toString() : ''}
					/>
				) : (
					text
				),
		};

	}

	const columns: ColumnsType<DataType> = [
		{
			title: 'Name',
			dataIndex: 'Name',
			key: "Name",
			...getColumnSearchProps('Name' as DataIndex)
		},
		{
			title: 'Email',
			dataIndex: 'Email',
			key: "Email",
			...getColumnSearchProps('Email' as DataIndex)
		},
		{
			title: 'Phone',
			dataIndex: 'Phone',
			key: "Phone",
			...getColumnSearchProps('Phone' as DataIndex)
		},
		{
			title: 'Address',
			dataIndex: 'Address',
			key: "Address",
			...getColumnSearchProps('Address' as DataIndex)
		},
		{
			title: 'Volume',
			dataIndex: 'Volume',
			key: "Volume",
			sorter: (a: any, b: any) => a.Volume - b.Volume,
		},
		{
			title: 'Quota',
			dataIndex: 'Quota',
			key: "Quota",
			sorter: (a: any, b: any) => a.Quota - b.Quota,
		}
];

	React.useEffect(() => {
		fetchCustomers()
		return () => {
			setData([])
		}
	}, [limit, page])

	return (
		<div>
			{contextHolder}
			<Table
				columns={columns}
				dataSource={data}
				loading={loading}
				rowKey={(record: any) => record._id}
				pagination={false}
			/>

			<Pagination
				style={{ marginTop: 20, marginLeft: "60%" }}
				current={page}
				pageSize={limit}
				total={total}
				showSizeChanger
				showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
				onChange={(page, limit) => {
					setPage(page)
					setLimit(limit)
				}}
			/>
		</div>
	)
}
