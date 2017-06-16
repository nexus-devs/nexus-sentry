#ifndef NEXUSSENTRY_H
#define NEXUSSENTRY_H

#include <node.h>
#include <node_object_wrap.h>

namespace addon {

class NexusSentry : public node::ObjectWrap {
 public:
  static void Init(v8::Local<v8::Object> exports);

 private:
  explicit NexusSentry(double value = 0);
  ~NexusSentry();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void PlusOne(const v8::FunctionCallbackInfo<v8::Value>& args);
  static v8::Persistent<v8::Function> constructor;
};

}  // addon namespace

#endif
