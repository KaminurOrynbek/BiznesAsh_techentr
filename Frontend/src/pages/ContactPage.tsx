import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, MapPin, Clock, Send, Phone, Globe, Instagram, Twitter, Linkedin } from "lucide-react";
import { Navbar, Card, Button, Input, TextArea, Alert } from "../components";

export const ContactPage = () => {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log("Contact form submission:", formData);
            setSuccess(true);
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (err) {
            setError(t('messageError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
            <Navbar />

            <main className="container-page py-20 pt-32">
                <div className="text-center mb-16">
                    <h1 className="h1 mb-4 text-slate-900 dark:text-white">{t('contactUs')}</h1>
                    <p className="sub max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
                        {t('contactSubtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">{t('contactInfo')}</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl text-blue-600 dark:text-blue-400">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{t('emailLabel')}</p>
                                        <p className="text-slate-600 dark:text-slate-400 font-medium">support@biznesash.kz</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-teal-100 dark:bg-teal-900/30 p-3 rounded-xl text-teal-600 dark:text-teal-400">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{t('location')}</p>
                                        <p className="text-slate-600 dark:text-slate-400 font-medium">{t('astanaKazakhstan')}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-xl text-indigo-600 dark:text-indigo-400">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{t('workingHours')}</p>
                                        <p className="text-slate-600 dark:text-slate-400 font-medium">{t('workingHoursDetail')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{t('followUs')}</h3>
                            <div className="flex gap-4">
                                <a href="#" className="h-10 w-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-600 transition-all">
                                    <Instagram size={20} />
                                </a>
                                <a href="#" className="h-10 w-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-600 transition-all">
                                    <Twitter size={20} />
                                </a>
                                <a href="#" className="h-10 w-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-600 transition-all">
                                    <Linkedin size={20} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="p-8 glass shadow-xl border-none">
                            <h2 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white">{t('getInTouch')}</h2>

                            {success && (
                                <div className="mb-6">
                                    <Alert type="success" message={t('messageSent')} onClose={() => setSuccess(false)} />
                                </div>
                            )}

                            {error && (
                                <div className="mb-6">
                                    <Alert type="error" message={error} onClose={() => setError("")} />
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        name="name"
                                        label={t('fullName')}
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        name="email"
                                        label={t('emailLabel')}
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <Input
                                    name="subject"
                                    label={t('subject')}
                                    placeholder={t('howItWorks')}
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />

                                <TextArea
                                    name="message"
                                    label={t('message')}
                                    placeholder={t('shareThoughts')}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                />

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full md:w-auto h-12 px-8 text-base shadow-lg shadow-blue-500/20"
                                    disabled={isSubmitting}
                                >
                                    <span className="flex items-center gap-2">
                                        <Send size={18} />
                                        {isSubmitting ? t('sendingMessage') : t('sendMessage')}
                                    </span>
                                </Button>
                            </form>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};
