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
