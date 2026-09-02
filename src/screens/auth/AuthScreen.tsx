import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Flame, Phone, Mail, ArrowRight, X, ShieldCheck } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors, BorderRadius, Spacing, Typography } from '../../theme';
import { GradientButton } from '../../components/common/GradientButton';
import { useAuthStore } from '../../store/useAuthStore';

export const AuthScreen: React.FC = () => {
  const [authMode, setAuthMode] = useState<'PHONE' | 'EMAIL'>('PHONE');
  const [phoneNumber, setPhoneNumber] = useState('5552345678');
  const [countryCode, setCountryCode] = useState('+1');
  const [email, setEmail] = useState('');
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);

  const otpInputRefs = useRef<(TextInput | null)[]>([]);
  const { login, verifyOtp, isLoading, error, clearError } = useAuthStore();

  useEffect(() => {
    let interval: any;
    if (isOtpModalVisible && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpModalVisible, resendTimer]);

  const handleSendOtp = async () => {
    clearError();
    const fullTarget = authMode === 'PHONE' ? `${countryCode}${phoneNumber}` : email;
    const success = await login({
      phone_number: authMode === 'PHONE' ? fullTarget : undefined,
      email: authMode === 'EMAIL' ? fullTarget : undefined,
    });
    if (success) {
      setIsOtpModalVisible(true);
      setResendTimer(60);
      setOtpDigits(['', '', '', '', '', '']);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const newDigits = [...otpDigits];
    newDigits[index] = text;
    setOtpDigits(newDigits);

    if (text && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto verify when 6th digit entered
    if (index === 5 && text) {
      const fullOtp = newDigits.join('');
      handleVerify(fullOtp);
    }
  };

  const handleVerify = async (otpCode: string) => {
    const fullTarget = authMode === 'PHONE' ? `${countryCode}${phoneNumber}` : email;
    await verifyOtp({
      phone_number: authMode === 'PHONE' ? fullTarget : undefined,
      email: authMode === 'EMAIL' ? fullTarget : undefined,
      otp: otpCode,
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#180828', '#0A0D14', '#0A0D14']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo & Brand Header */}
          <View style={styles.logoSection}>
            <LinearGradient
              colors={[Colors.primaryGradientStart, Colors.primaryGradientEnd]}
              style={styles.logoCircle}
            >
              <Flame size={48} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.brandTitle}>MILOO</Text>
            <Text style={styles.tagline}>Ultra-Luxe Real-Time Dating</Text>
          </View>

          {/* Mode Switcher (Phone / Email) */}
          <View style={styles.tabSwitcher}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setAuthMode('PHONE')}
              style={[styles.tabButton, authMode === 'PHONE' && styles.tabButtonActive]}
            >
              <Phone size={16} color={authMode === 'PHONE' ? '#FFFFFF' : Colors.textMuted} />
              <Text style={[styles.tabText, authMode === 'PHONE' && styles.tabTextActive]}>
                Phone Number
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setAuthMode('EMAIL')}
              style={[styles.tabButton, authMode === 'EMAIL' && styles.tabButtonActive]}
            >
              <Mail size={16} color={authMode === 'EMAIL' ? '#FFFFFF' : Colors.textMuted} />
              <Text style={[styles.tabText, authMode === 'EMAIL' && styles.tabTextActive]}>
                Email
              </Text>
            </TouchableOpacity>
          </View>

          {/* Input Form */}
          <View style={styles.formContainer}>
            {authMode === 'PHONE' ? (
              <View style={styles.phoneInputRow}>
                <View style={styles.countryCodeBox}>
                  <Text style={styles.countryCodeText}>{countryCode}</Text>
                </View>
                <TextInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  placeholder="Enter phone number"
                  placeholderTextColor={Colors.textMuted}
                  style={styles.phoneTextInput}
                />
              </View>
            ) : (
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="name@example.com"
                placeholderTextColor={Colors.textMuted}
                style={styles.emailTextInput}
              />
            )}

            {error && <Text style={styles.errorBanner}>{error}</Text>}

            <GradientButton
              title="Continue"
              onPress={handleSendOtp}
              loading={isLoading}
              icon={<ArrowRight size={20} color="#FFFFFF" />}
              style={styles.continueButton}
            />
          </View>

          {/* Social Auth / Quick Demo bypass */}
          <View style={styles.footerSection}>
            <Text style={styles.legalNotice}>
              By continuing, you agree to our Terms of Service & Privacy Policy.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 6-Digit OTP Bottom Sheet Modal */}
      <Modal visible={isOtpModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <BlurView intensity={90} tint="dark" style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setIsOtpModalVisible(false)}
                style={styles.closeBtn}
              >
                <X size={22} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.otpIconBadge}>
              <ShieldCheck size={32} color={Colors.secondary} />
            </View>

            <Text style={[Typography.h2, styles.otpTitle]}>Verification Code</Text>
            <Text style={styles.otpSubtitle}>
              Please enter the 6-digit code sent to{' '}
              <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>
                {authMode === 'PHONE' ? `${countryCode} ${phoneNumber}` : email}
              </Text>
            </Text>

            {/* 6 Digits Boxes */}
            <View style={styles.otpBoxContainer}>
              {otpDigits.map((digit, idx) => (
                <TextInput
                  key={idx}
                  ref={(ref) => { otpInputRefs.current[idx] = ref; }}
                  value={digit}
                  onChangeText={(t) => handleOtpChange(t, idx)}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={[
                    styles.otpBox,
                    digit ? styles.otpBoxFilled : null,
                  ]}
                />
              ))}
            </View>

            {/* Resend countdown */}
            <View style={styles.resendRow}>
              {resendTimer > 0 ? (
                <Text style={styles.resendText}>
                  Resend code in <Text style={{ color: Colors.secondary }}>{resendTimer}s</Text>
                </Text>
              ) : (
                <TouchableOpacity onPress={handleSendOtp}>
                  <Text style={styles.resendActiveText}>Resend Code</Text>
                </TouchableOpacity>
              )}
            </View>

            <GradientButton
              title="Verify & Enter"
              onPress={() => handleVerify(otpDigits.join(''))}
              loading={isLoading}
              style={{ marginTop: 24 }}
            />
          </BlurView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  tagline: {
    ...Typography.subtitle,
    color: Colors.textSecondary,
    marginTop: 4,
    letterSpacing: 1,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: BorderRadius.full,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    gap: 8,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  tabText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  formContainer: {
    marginBottom: Spacing.xl,
  },
  phoneInputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: Spacing.md,
  },
  countryCodeBox: {
    width: 70,
    height: 54,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryCodeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  phoneTextInput: {
    flex: 1,
    height: 54,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
  emailTextInput: {
    height: 54,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.inputBackground,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: Spacing.md,
  },
  continueButton: {
    marginTop: 10,
  },
  errorBanner: {
    ...Typography.caption,
    color: Colors.error,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  footerSection: {
    alignItems: 'center',
  },
  legalNotice: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: 'rgba(18, 23, 34, 0.98)',
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    paddingBottom: 48,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  modalHeader: {
    alignItems: 'flex-end',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpIconBadge: {
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  otpTitle: {
    textAlign: 'center',
    marginBottom: 6,
  },
  otpSubtitle: {
    ...Typography.bodySecondary,
    textAlign: 'center',
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  otpBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: Spacing.lg,
  },
  otpBox: {
    flex: 1,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  otpBoxFilled: {
    borderColor: Colors.secondary,
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
  },
  resendRow: {
    alignItems: 'center',
    marginTop: 4,
  },
  resendText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  resendActiveText: {
    ...Typography.caption,
    color: Colors.secondary,
    fontWeight: '700',
  },
});
