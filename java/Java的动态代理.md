











### 实战：Jdk Proxy[^1] 动态代理

[^1]: [ˈprɒksi]

```java {.line-numbers}
@FunctionalInterface
public interface Talkable {
    void say();
}
///////////////////////////////////////////////////////
public class Cat implements Talkable{
    @Override
    public void say() {
        System.out.println("I am a Cat");
    }
}
///////////////////////////////////////////////////////

public class CatProxy implements InvocationHandler {
    //保存被代理的对象
    private Object target;
    public CatProxy(Object target){
        this.target=target;
    }
    public static void main(String[] args) {
        Talkable proxyInstance = (Talkable)Proxy.newProxyInstance(Cat.class.getClassLoader(),
                Cat.class.getInterfaces(), new CatProxy(new Cat()));
        proxyInstance.say();
    }
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        //proxy:生成的代理对象
        if("say".equals(method.getName())){
            System.out.println("before say");
            Object result = method.invoke(target, args);
            System.out.println("after say");
            return result;
        }
        return null;
    }
}
