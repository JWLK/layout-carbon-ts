import { TABLE_SORT_DIRECTION } from '@hooks/useTable/misc'

export const columns = [
    {
        id: 'name',
        title: 'Name',
        sortCycle: 'bi-states-from-ascending',
    },
    {
        id: 'protocol',
        title: 'Protocol',
    },
    {
        id: 'port',
        title: 'Port',
        sortCycle: 'tri-states-from-ascending',
    },
]

export const columWithStatus = [
    {
        id: 'name',
        title: 'Name',
        sortCycle: 'bi-states-from-ascending',
    },
    {
        id: 'protocol',
        title: 'Protocol',
    },
    {
        id: 'port',
        title: 'Port',
        sortCycle: 'tri-states-from-ascending',
    },
    {
        id: 'status',
        title: 'Status',
        sortCycle: 'tri-states-from-ascending',
    },
]

export const rows = [
    {
        id: 0,
        name: 'Load Balancer 1',
        protocol: 'HTTP',
        port: 80,
        detail: 'Expanded Detail Data : Load Balancer 1',
    },
    {
        id: 1,
        name: 'Load Balancer 2',
        protocol: 'HTTPS',
        port: 443,
        detail: 'Expanded Detail Data : Load Balancer 2',
    },
    {
        id: 2,
        name: 'Load Balancer 3',
        protocol: 'HTTP',
        port: 80,
        selected: true,
        detail: 'Expanded Detail Data : Load Balancer 3',
    },
]

export const rowsInitProtocol = {
    selected: [
        {
            id: 2,
            name: 'Load Balancer 3',
            protocol: 'HTTP',
            port: 80,
            detail: 'Expanded Detail Data',
        },
    ],
    total: [
        {
            id: 0,
            name: 'Load Balancer 1',
            protocol: 'HTTP',
            port: 80,
            detail: 'Expanded Detail Data : Load Balancer 1',
        },
        {
            id: 1,
            name: 'Load Balancer 2',
            protocol: 'HTTPS',
            port: 443,
            detail: 'Expanded Detail Data : Load Balancer 2',
        },
        {
            id: 2,
            name: 'Load Balancer 3',
            protocol: 'HTTP',
            port: 80,
            selected: true,
            detail: 'Expanded Detail Data : Load Balancer 3',
        },
    ],
}

export const rowsMany = Array.from(new Array(50))
    .map((_item, i) =>
        rows.map((row, j) => ({
            ...row,
            id: i * 3 + j,
            name: `Load Balancer ${String(i * 3 + j + 1).padStart(3, '0')}`,
        })),
    )
    .flat()

export const sortInfo = {
    columnId: 'name',
    direction: TABLE_SORT_DIRECTION.ASCENDING,
}