# API Functions Required for Dashboard Pages

This document lists all API functions that need to be implemented in `src/services/api.js` for the dashboard pages to work correctly.

## Required API Functions by Page

### HomePage
- `getTransactions(userId)` - Get user's transactions
- `getPaymentMethods(userId)` - Get linked payment methods
- `getRoutingRules(userId)` - Get user's routing rules
- `getGroups(userId)` - Get user's groups

### VirtualCardPage
- `getIssuedCard(userId)` - Get user's virtual card (404 if not exists)
- `setupIssuedCard(userId, formData)` - Create new virtual card
- `updateCardStatus(cardId, status)` - Update card status (active/frozen)
- `getCardDetails(cardId)` - Get full card number and CVC

### RoutingRulesPage
- `getRoutingRules(userId)` - Get all routing rules
- `getPaymentMethods(userId)` - Get linked cards for rule actions
- `createRoutingRule(userId, ruleData)` - Create new routing rule
- `updateRoutingRule(ruleId, updates)` - Update routing rule
- `suggestRulesFromAI(userId, prompt)` - Generate AI suggestions

### TransactionsPage
- `getTransactions(userId)` - Get transaction history with splits
- `retryTransaction(transactionId)` - Retry failed transaction

### CardsPage
- `getPaymentMethods(userId)` - Get all payment methods
- `deletePaymentMethod(cardId)` - Delete payment method

### SplitRulesPage
- `getActiveSplitRule(userId)` - Get current active split rule
- `getPaymentMethods(userId)` - Get available cards
- `createSplitRule(userId, ruleData)` - Create/update split rule

### RewardsPage
- `getCardRewards(userId)` - Get linked rewards for user's cards
- `getRewardTemplates()` - Get available reward templates
- `getPaymentMethods(userId)` - Get user's cards
- `saveCardReward(userId, rewardData)` - Link reward to card
- `deleteCardReward(rewardId)` - Unlink reward from card

### AnalyticsPage
- `getAnalytics(userId, year, month)` - Get analytics for specific month
- `getAnalyticsHistory(userId)` - Get historical analytics data

### SubscriptionsPage
- `getSubscriptions(userId)` - Get detected subscriptions
- `getPaymentMethods(userId)` - Get cards for assignment
- `updateSubscription(subscriptionId, updates)` - Update subscription

### GroupsPage
- `getGroups(userId)` - Get user's groups
- `createGroup(userId, groupData)` - Create new group
- `remindGroupMember(groupId, memberId)` - Send payment reminder
- `settleGroup(groupId)` - Mark group as settled

### SettingsPage
- `getBillingStatus(userId)` - Get user's billing information

## Complete List (Alphabetical)

1. `createGroup(userId, groupData)`
2. `createRoutingRule(userId, ruleData)`
3. `createSplitRule(userId, ruleData)`
4. `deleteCardReward(rewardId)`
5. `deletePaymentMethod(cardId)`
6. `getActiveSplitRule(userId)`
7. `getAnalytics(userId, year, month)`
8. `getAnalyticsHistory(userId)`
9. `getBillingStatus(userId)`
10. `getCardDetails(cardId)`
11. `getCardRewards(userId)`
12. `getGroups(userId)`
13. `getIssuedCard(userId)`
14. `getPaymentMethods(userId)`
15. `getRewardTemplates()`
16. `getRoutingRules(userId)`
17. `getSubscriptions(userId)`
18. `getTransactions(userId)`
19. `remindGroupMember(groupId, memberId)`
20. `retryTransaction(transactionId)`
21. `saveCardReward(userId, rewardData)`
22. `settleGroup(groupId)`
23. `setupIssuedCard(userId, formData)`
24. `suggestRulesFromAI(userId, prompt)`
25. `updateCardStatus(cardId, status)`
26. `updateRoutingRule(ruleId, updates)`
27. `updateSubscription(subscriptionId, updates)`

## Total: 27 API Functions

## Data Structure Examples

### Transaction Object
```javascript
{
  id: string,
  merchant_name: string,
  amount: number (cents),
  category: string,
  status: 'completed' | 'failed' | 'pending' | 'partially_failed',
  created_at: ISO string,
  splits: [
    {
      id: string,
      card_last4: string,
      amount: number (cents),
      split_type: string,
      status: string
    }
  ]
}
```

### Payment Method Object
```javascript
{
  id: string,
  brand: string ('visa', 'mastercard', etc),
  last4: string,
  expiry: string ('MM/YY'),
  cardholder_name: string,
  nickname: string,
  type: 'credit' | 'debit'
}
```

### Routing Rule Object
```javascript
{
  id: string,
  name: string,
  priority: number,
  active: boolean,
  conditions: [
    {
      type: string,
      value: string
    }
  ],
  actions: [
    {
      type: string,
      card_id?: string,
      value?: string
    }
  ]
}
```

### Subscription Object
```javascript
{
  id: string,
  merchant_name: string,
  amount: number (cents),
  frequency: string,
  status: 'active' | 'snoozed' | 'cancelled',
  assigned_card_last4?: string,
  card_id?: string,
  snoozed_until?: ISO string
}
```

### Group Object
```javascript
{
  id: string,
  name: string,
  total_amount: number (cents),
  status: 'pending' | 'in_progress' | 'settled',
  collection_progress: number (0-100),
  members: [
    {
      id: string,
      name: string,
      email: string,
      amount_owed: number (cents),
      paid: boolean
    }
  ]
}
```
