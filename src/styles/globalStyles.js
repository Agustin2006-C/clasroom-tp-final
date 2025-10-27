import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../utils/constants';

const { width, height } = Dimensions.get('window');

export const globalStyles = StyleSheet.create({
  // ===== LAYOUT =====
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  flexGrow1: {
    flexGrow: 1,
  },
  
  // ===== TYPOGRAPHY =====
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  caption: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  captionSmall: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  
  // ===== CARDS =====
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  
  // ===== BUTTONS =====
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonOutlineText: {
    color: COLORS.primary,
  },
  buttonDanger: {
    backgroundColor: COLORS.danger,
  },
  buttonDangerText: {
    color: COLORS.white,
  },
  buttonSuccess: {
    backgroundColor: COLORS.success,
  },
  buttonSuccessText: {
    color: COLORS.white,
  },
  buttonWarning: {
    backgroundColor: COLORS.warning,
  },
  buttonWarningText: {
    color: COLORS.white,
  },
  buttonDisabled: {
    backgroundColor: COLORS.light,
  },
  buttonDisabledText: {
    color: COLORS.textSecondary,
  },
  buttonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  buttonSmallText: {
    fontSize: 14,
  },
  buttonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },
  buttonLargeText: {
    fontSize: 18,
  },
  
  // ===== FORMS =====
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
    minHeight: 48,
  },
  inputFocus: {
    borderColor: COLORS.primary,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  inputDisabled: {
    backgroundColor: COLORS.background,
    color: COLORS.textSecondary,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  helperText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  
  // ===== BADGES =====
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  badgePrimary: {
    backgroundColor: COLORS.primary,
  },
  badgeSuccess: {
    backgroundColor: COLORS.success,
  },
  badgeWarning: {
    backgroundColor: COLORS.warning,
  },
  badgeDanger: {
    backgroundColor: COLORS.danger,
  },
  badgeLight: {
    backgroundColor: COLORS.light,
  },
  
  // ===== LISTS =====
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  listItemContent: {
    flex: 1,
    marginRight: 12,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  listItemChevron: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  
  // ===== LAYOUT UTILITIES =====
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowAround: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  
  // ===== SPACING =====
  m4: { margin: 4 },
  m8: { margin: 8 },
  m16: { margin: 16 },
  mt4: { marginTop: 4 },
  mt8: { marginTop: 8 },
  mt16: { marginTop: 16 },
  mb4: { marginBottom: 4 },
  mb8: { marginBottom: 8 },
  mb16: { marginBottom: 16 },
  ml4: { marginLeft: 4 },
  ml8: { marginLeft: 8 },
  ml16: { marginLeft: 16 },
  mr4: { marginRight: 4 },
  mr8: { marginRight: 8 },
  mr16: { marginRight: 16 },
  mx4: { marginHorizontal: 4 },
  mx8: { marginHorizontal: 8 },
  mx16: { marginHorizontal: 16 },
  my4: { marginVertical: 4 },
  my8: { marginVertical: 8 },
  my16: { marginVertical: 16 },
  
  p4: { padding: 4 },
  p8: { padding: 8 },
  p16: { padding: 16 },
  pt4: { paddingTop: 4 },
  pt8: { paddingTop: 8 },
  pt16: { paddingTop: 16 },
  pb4: { paddingBottom: 4 },
  pb8: { paddingBottom: 8 },
  pb16: { paddingBottom: 16 },
  pl4: { paddingLeft: 4 },
  pl8: { paddingLeft: 8 },
  pl16: { paddingLeft: 16 },
  pr4: { paddingRight: 4 },
  pr8: { paddingRight: 8 },
  pr16: { paddingRight: 16 },
  px4: { paddingHorizontal: 4 },
  px8: { paddingHorizontal: 8 },
  px16: { paddingHorizontal: 16 },
  py4: { paddingVertical: 4 },
  py8: { paddingVertical: 8 },
  py16: { paddingVertical: 16 },
  
  // ===== ALIGNMENT =====
  textLeft: { textAlign: 'left' },
  textCenter: { textAlign: 'center' },
  textRight: { textAlign: 'right' },
  alignStart: { alignItems: 'flex-start' },
  alignCenter: { alignItems: 'center' },
  alignEnd: { alignItems: 'flex-end' },
  justifyStart: { justifyContent: 'flex-start' },
  justifyCenter: { justifyContent: 'center' },
  justifyEnd: { justifyContent: 'flex-end' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyAround: { justifyContent: 'space-around' },
  
  // ===== DIMENSIONS =====
  fullWidth: { width: '100%' },
  fullHeight: { height: '100%' },
  screenWidth: { width },
  screenHeight: { height },
  
  // ===== BORDERS =====
  border: {
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  borderLeft: {
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  
  // ===== BACKGROUNDS =====
  bgPrimary: { backgroundColor: COLORS.primary },
  bgSuccess: { backgroundColor: COLORS.success },
  bgWarning: { backgroundColor: COLORS.warning },
  bgDanger: { backgroundColor: COLORS.danger },
  bgLight: { backgroundColor: COLORS.light },
  bgDark: { backgroundColor: COLORS.dark },
  bgWhite: { backgroundColor: COLORS.white },
  bgBackground: { backgroundColor: COLORS.background },
  bgTransparent: { backgroundColor: 'transparent' },
  
  // ===== TEXT COLORS =====
  textPrimary: { color: COLORS.primary },
  textSuccess: { color: COLORS.success },
  textWarning: { color: COLORS.warning },
  textDanger: { color: COLORS.danger },
  textLight: { color: COLORS.light },
  textDark: { color: COLORS.dark },
  textWhite: { color: COLORS.white },
});

export default globalStyles;