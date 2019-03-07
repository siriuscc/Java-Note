
### stack：栈

```cpp
#include<stack>

using namespace std;



// 创建-不需要初始化
stack<TreeNode *>  stk;

void stk.push(p)
void stk.pop();
p=top();
length=stk.size() 
if(!stk.emtpy()){
    ...
}

```
### queue：队列

```cpp
void queue_demo(){
    queue<int> que;
    que.push(1);
    que.push(2);
    que.push(3);
    que.pop();
    cout<<que.empty()<<endl;
    cout<<que.front()<<endl;
    cout<<que.back()<<endl;
}
```


### list：双向链表
```cpp

void list_demo()
{
    //创建,双向链表
    std::list<int> slist;
    slist.push_front(1);
    slist.push_front(2);
    slist.push_front(3);
    slist.push_back(10);
    cout << slist.size() << endl;

    // 在指定位置插入 6 个7
    slist.insert(slist.begin(), 6, 7);

    // 迭代器迭代
    list<int>::iterator elem;
    for (elem = slist.begin(); elem != slist.end(); ++elem) {
        cout << *elem << ",";
    }
    //删除
    slist.erase(slist.begin());
    //范围删除
    //slist.erase(slist.begin(),slist.end());
    // 反转
    slist.reverse();
    //排序
    slist.sort();
    // 订制算法排序
    slist.sort(sortFunc);
}

```