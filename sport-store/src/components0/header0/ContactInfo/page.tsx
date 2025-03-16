import React from "react";

const ContactInfo = ({ icon: Icon, text, subtext }: { icon: React.ElementType; text: string; subtext: string }) => (
  <div className="flex items-center gap-3 text-lg">
    <Icon className="w-6 h-6 text-black" />
    <div>
      <div className="font-semibold text-black">{text}</div>
      <div className="text-gray-500 text-sm">{subtext}</div>
    </div>
  </div>
);

export default ContactInfo;