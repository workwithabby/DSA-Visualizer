export interface LanguageCode {
  language: "python" | "java" | "cpp" | "javascript";
  code: string;
}

export const bubbleSortCode: LanguageCode[] = [
  {
    language: "python",
    code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            # Compare adjacent elements
            if arr[j] > arr[j + 1]:
                # Swap if in wrong order
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        # If no swaps, array is sorted
        if not swapped:
            break
    return arr`,
  },
  {
    language: "java",
    code: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            // Compare adjacent elements
            if (arr[j] > arr[j + 1]) {
                // Swap if in wrong order
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        // If no swaps, array is sorted
        if (!swapped) break;
    }
}`,
  },
  {
    language: "cpp",
    code: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            // Compare adjacent elements
            if (arr[j] > arr[j + 1]) {
                // Swap if in wrong order
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        // If no swaps, array is sorted
        if (!swapped) break;
    }
}`,
  },
  {
    language: "javascript",
    code: `function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            // Compare adjacent elements
            if (arr[j] > arr[j + 1]) {
                // Swap if in wrong order
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        // If no swaps, array is sorted
        if (!swapped) break;
    }
    return arr;
}`,
  },
];

export const linearSearchCode: LanguageCode[] = [
  {
    language: "python",
    code: `def linear_search(arr, target):
    for i in range(len(arr)):
        # Compare current element
        if arr[i] == target:
            return i
    return -1`,
  },
  {
    language: "java",
    code: `public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        // Compare current element
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}`,
  },
  {
    language: "cpp",
    code: `int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        // Compare current element
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}`,
  },
  {
    language: "javascript",
    code: `function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        // Compare current element
        if (arr[i] === target) {
            return i;
        }
    }
    return -1;
}`,
  },
];

export const binarySearchCode: LanguageCode[] = [
  {
    language: "python",
    code: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        # Compare mid element with target
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
  },
  {
    language: "java",
    code: `public static int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
        int mid = (low + high) / 2;
        // Compare mid element with target
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
  },
  {
    language: "cpp",
    code: `int binarySearch(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        // Compare mid element with target
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
  },
  {
    language: "javascript",
    code: `function binarySearch(arr, target) {
    let low = 0, high = arr.length - 1;
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        // Compare mid element with target
        if (arr[mid] === target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
  },
];

export const selectionSortCode: LanguageCode[] = [
  {
    language: "python",
    code: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            # Find minimum in unsorted portion
            if arr[j] < arr[min_idx]:
                min_idx = j
        # Swap minimum with first unsorted element
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
  },
  {
    language: "javascript",
    code: `function selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (minIdx !== i) [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
    return arr;
}`,
  },
];

export const insertionSortCode: LanguageCode[] = [
  {
    language: "python",
    code: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        # Shift elements greater than key to the right
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        # Insert key at correct position
        arr[j + 1] = key
    return arr`,
  },
  {
    language: "javascript",
    code: `function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        const key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}`,
  },
];

export const mergeSortCode: LanguageCode[] = [
  {
    language: "python",
    code: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
  },
  {
    language: "javascript",
    code: `function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) result.push(left[i++]);
        else result.push(right[j++]);
    }
    return result.concat(left.slice(i), right.slice(j));
}`,
  },
];

export const quickSortCode: LanguageCode[] = [
  {
    language: "python",
    code: `def quick_sort(arr, low, high):
    if low < high:
        pivot_idx = partition(arr, low, high)
        quick_sort(arr, low, pivot_idx - 1)
        quick_sort(arr, pivot_idx + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
  },
  {
    language: "javascript",
    code: `function quickSort(arr, low, high) {
    if (low < high) {
        const p = partition(arr, low, high);
        quickSort(arr, low, p - 1);
        quickSort(arr, p + 1, high);
    }
}

function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}`,
  },
];

export const heapSortCode: LanguageCode[] = [
  {
    language: "python",
    code: `def heapify(arr, n, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    if left < n and arr[left] > arr[largest]:
        largest = left
    if right < n and arr[right] > arr[largest]:
        largest = right
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)

def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)
    return arr`,
  },
  {
    language: "javascript",
    code: `function heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1, right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest);
    }
}

function heapSort(arr) {
    const n = arr.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i);
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        heapify(arr, i, 0);
    }
    return arr;
}`,
  },
];

export const bfsCode: LanguageCode[] = [
  {
    language: "python",
    code: `from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    while queue:
        node = queue.popleft()
        process(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)`,
  },
  {
    language: "javascript",
    code: `function bfs(graph, start) {
    const visited = new Set();
    const queue = [start];
    visited.add(start);
    while (queue.length > 0) {
        const node = queue.shift();
        process(node);
        for (const neighbor of graph[node]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
}`,
  },
];

export const dfsCode: LanguageCode[] = [
  {
    language: "python",
    code: `def dfs(graph, node, visited=None):
    if visited is None:
        visited = set()
    visited.add(node)
    process(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)`,
  },
  {
    language: "javascript",
    code: `function dfs(graph, node, visited = new Set()) {
    visited.add(node);
    process(node);
    for (const neighbor of graph[node]) {
        if (!visited.has(neighbor)) {
            dfs(graph, neighbor, visited);
        }
    }
}`,
  },
];

export const dijkstraCode: LanguageCode[] = [
  {
    language: "python",
    code: `import heapq

def dijkstra(graph, start):
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    pq = [(0, start)]
    visited = set()
    while pq:
        d, u = heapq.heappop(pq)
        if u in visited:
            continue
        visited.add(u)
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    return dist`,
  },
  {
    language: "javascript",
    code: `function dijkstra(graph, start) {
    const dist = {};
    for (const node in graph) dist[node] = Infinity;
    dist[start] = 0;
    const pq = [{ node: start, dist: 0 }];
    const visited = new Set();
    while (pq.length > 0) {
        pq.sort((a, b) => a.dist - b.dist);
        const { node: u, dist: d } = pq.shift();
        if (visited.has(u)) continue;
        visited.add(u);
        for (const { node: v, weight: w } of graph[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({ node: v, dist: dist[v] });
            }
        }
    }
    return dist;
}`,
  },
];

const STACK_PY = `class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        return self.items.pop()

    def peek(self):
        return self.items[-1]

    def is_empty(self):
        return len(self.items) == 0`;
const STACK_JAVA = `public class Stack<T> {
    private java.util.ArrayList<T> items;

    public Stack() { items = new ArrayList<>(); }

    public void push(T item) { items.add(item); }

    public T pop() { return items.remove(items.size() - 1); }

    public T peek() { return items.get(items.size() - 1); }

    public boolean isEmpty() { return items.isEmpty(); }
}`;
const STACK_CPP = `template <typename T>
class Stack {
private:
    vector<T> items;
public:
    void push(const T& item) { items.push_back(item); }
    T pop() {
        T val = items.back();
        items.pop_back();
        return val;
    }
    T& peek() { return items.back(); }
    bool isEmpty() { return items.empty(); }
};`;
const STACK_JS = `class Stack {
    constructor() { this.items = []; }

    push(item) { this.items.push(item); }

    pop() { return this.items.pop(); }

    peek() { return this.items[this.items.length - 1]; }

    isEmpty() { return this.items.length === 0; }
}`;

export const stackCode: LanguageCode[] = [
  { language: "python", code: STACK_PY },
  { language: "java", code: STACK_JAVA },
  { language: "cpp", code: STACK_CPP },
  { language: "javascript", code: STACK_JS },
];
